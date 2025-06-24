import React, { useEffect, useState } from 'react';
import { UserPlus, Users, Trash2, X, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchInvitesByProjectId,
  inviteCollaborator,
  deleteInvite,
} from '../../store/invites';
import { getAllUsers } from '../../store/auth';
import Swal from 'sweetalert2';
import { deleteConversation, fetchMessagesByProject } from '../../store/message';

function AddCollab({ projectId }) {
  const dispatch = useDispatch();
  const { user, UsersList } = useSelector((state) => state.auth);
  const { invites } = useSelector((state) => state.projectInvites);

  const [showTeammates, setShowTeammates] = useState(false);
  const [showModal, setShowModal] = useState(false);

  console.log(UsersList, showModal, "dondo batanan")

  const handleInvite = async (userId) => {
    try {
      await dispatch(inviteCollaborator({ projectId, invitedUserId: userId })).unwrap();
      toast.success('Invite sent', { position: 'bottom-right' });
      dispatch(fetchInvitesByProjectId(projectId));
    } catch (err) {
      toast.error(err || 'Failed to send invite', { position: 'bottom-right' });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    dispatch(deleteConversation(projectId))
      .unwrap()
      .then((data) => {
        if (data?.success) {
          toast.success(data?.message, { position: 'bottom-right' });
          setShowTeammates(false);
          dispatch(fetchMessagesByProject(projectId));
        }
      });
  };

  const handleDeleteInvite = async (inviteId) => {
    const result = await Swal.fire({
      title: 'Remove Invite?',
      text: 'This invite will be deleted and cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    dispatch(deleteInvite(inviteId))
      .unwrap()
      .then(() => {
        toast.success('Invite removed successfully.', { position: 'bottom-right' });
        dispatch(fetchInvitesByProjectId(projectId));
      })
      .catch((err) => {
        toast.error(err || 'Failed to remove invite.', { position: 'bottom-right' });
      });
  };

useEffect(() => {
  if (showModal && UsersList.length === 0) {
    dispatch(getAllUsers()).unwrap().catch(console.error);
  }
}, [showModal]);


  useEffect(() => {
    dispatch(fetchInvitesByProjectId(projectId)).unwrap().catch(console.error);
  }, [dispatch, projectId]);

  return (
    <div className="top-0 flex-shrink-0 bg-[rgb(24,32,46)] z-10 border-b border-teal-800/40 h-[50px]">
      <div className="flex items-center justify-between mb-6">
        <Button
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-sm"
          onClick={() =>
             setShowModal(true)}
        >
          <UserPlus size={16} /> Add Collaborator
        </Button>

        <button
          className="text-gray-300 hover:text-teal-400"
          onClick={() => setShowTeammates(!showTeammates)}
        >
          <Users size={20} />
        </button>
      </div>

     {showModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    onClick={() => setShowModal(false)} 
  >
    <div
      className="bg-[rgb(24,32,46)] rounded-lg shadow-lg p-6 w-full max-w-md"
      onClick={(e) => e.stopPropagation()} 
    >

            <h2 className="text-lg font-semibold text-white mb-4">Select a User to Invite</h2>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {UsersList.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-2 bg-[rgb(28,39,62)] hover:bg-[rgb(6,10,18)] rounded"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center text-white">
                      <UserRound />
                    </div>
                    <div>
                      <p className="text-white font-medium">{u.username}</p>
                      <p className="text-gray-400 text-xs">{u.email}</p>
                    </div>
                  </div>
                  <Button className="text-black" size="sm" variant="outline"  onClick={() => handleInvite(u._id)}>
                    Invite
                  </Button>
                </div>
              ))}
            </div>
            <Button
              className="mt-4 w-full bg-teal-600 hover:bg-teal-500"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {showTeammates && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowTeammates(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-full md:w-72 bg-[rgb(24,32,46)] border-r border-teal-800/40 p-6 z-50 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-teal-400 font-semibold">Team Members & Invites</h3>
              <button onClick={() => setShowTeammates(false)}>
                <X size={20} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
            <ul className="space-y-3 text-gray-300">
              {invites.length === 0 && (
                <li className="flex items-center justify-between border-b border-teal-800/30 pb-1">
                  <span>you</span>
                  <span className="text-xs text-teal-400">(Admin)</span>
                </li>
              )}
              {invites.length > 0 && (
                <li className="flex items-center justify-between border-b border-teal-800/30 pb-1">
                  Invited by:{' '}
                  {invites[0].invitedBy._id === user.id ? 'You' : invites[0].invitedBy.username}
                </li>
              )}
              {invites.map((inv) => (
                <li
                  key={inv._id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-teal-800/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center text-white">
                      <UserRound />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {inv.invitedUser._id === user.id ? 'you' : inv.invitedUser.username}
                      </p>
                      <p className="text-xs">
                        <span
                          className={
                            inv.status === 'requested' ? 'text-yellow-400' : 'text-teal-400'
                          }
                        >
                          {inv.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  {inv.invitedBy._id === user.id && (
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleDeleteInvite(inv._id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
            <button
              onClick={handleDelete}
              className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl text-sm shadow-sm transition-all duration-200 mt-4"
            >
              Clear Conversation
            </button>
          </aside>
        </>
      )}
    </div>
  );
}

export default AddCollab;
