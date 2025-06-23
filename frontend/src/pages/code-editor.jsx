import React from 'react'
import { useParams } from 'react-router-dom';
import { fetchFileTree } from '../../store/project';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';


const Editor = () => {

    const { FileTrees } = useSelector((state) => state.project);

    const [currentFile, setCurrentFile] = useState([]);
    const [openFiles, setOpenFiles] = useState([]);


    const handleOpenFile = (filename) => {

        if (openFiles.includes(filename)) {
            setCurrentFile(filename);
            return;
        }
        setOpenFiles([...openFiles, filename]);
        setCurrentFile(filename);
    };

    const handleCloseFile = (filenameToClose) => {
        const newOpenFiles = openFiles.filter((f) => f !== filenameToClose);

        if (currentFile === filenameToClose) {
            if (newOpenFiles.length > 0) {
                setCurrentFile(newOpenFiles[newOpenFiles.length - 1]);
            } else {
                setCurrentFile(null);
            }
        }
        setOpenFiles(newOpenFiles);
    };

    useEffect(()=>{
             dispatch(fetchFileTree(projectId)).then((response)=>{
                 
                });
    })

    
    return (
        <div className="hidden md:flex flex-1 h-full">


            <aside className="w-1/4 bg-gray-800 text-gray-100 p-4 overflow-y-auto hidden md:block">
                <h3 className="text-sm font-semibold mb-2">Explorer</h3>
                <ul className="space-y-1 text-xs">
                    {Object.keys(FileTrees).map((file, index) => (
                        <li key={index} className="px-2 py-1 rounded hover:bg-gray-700 cursor-pointer">
                            <button
                                onClick={() => handleOpenFile(file)}
                                className="w-full text-left"
                            >
                                {file}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>




            <main className="flex-1 bg-gray-700 text-green-200 overflow-auto flex flex-col">
                {openFiles.length > 0 && (
                    <div className="flex bg-gray-800 border-b border-gray-700">
                        <div className='top w-full overflow-auto flex'>
                            {openFiles.map((file, idx) => (
                                <div
                                    key={idx}
                                    className={`
                  flex items-center space-x-1 px-3 py-1 
                  cursor-pointer 
                  ${currentFile === file ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700"}
                `}
                                >
                                    <button onClick={() => setCurrentFile(file)} className="font-medium">
                                        {file}
                                    </button>


                                    <button
                                        onClick={() => handleCloseFile(file)}
                                        className="text-gray-500 hover:text-red-400"
                                        title="Close"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>
                )}


                <div className="flex-1 overflow-y-auto">
                    {currentFile ? (
                        FileTrees[currentFile]?.file?.contents !== undefined && (
                            <textarea
                                className="w-full h-full p-4 bg-slate-700 resize-none outline-none font-mono text-sm"
                                value={FileTrees[currentFile].file.contents}
                            // onChange={(e) => {
                            //   setFileTree({
                            //     ...fileTree,
                            //     [currentFile]: {
                            //       file: {
                            //         contents: e.target.value
                            //       }
                            //     }
                            //   });
                            // }}
                            />
                        )
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 italic">
                            Select a file from the Explorer to view/edit
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}

export default Editor
