'use client'

import { useState, useEffect } from 'react'
import type { TeamMember, Invitation } from '@/lib/types/database'

interface TeamManagementProps {
  siteId: string
  isOpen: boolean
  onClose: () => void
}

export default function TeamManagement({ siteId, isOpen, onClose }: TeamManagementProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'viewer'>('viewer')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchTeamData()
    }
  }, [isOpen, siteId])

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sites/${siteId}/team`)
      if (!response.ok) throw new Error('Failed to fetch team data')
      const data = await response.json()
      setTeamMembers(data.teamMembers || [])
      setInvitations(data.invitations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team data')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/sites/${siteId}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send invitation')
      }

      setInviteEmail('')
      await fetchTeamData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return

    try {
      setLoading(true)
      const response = await fetch(`/api/sites/${siteId}/team/${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove team member')
      await fetchTeamData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove team member')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/invitations/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
      })

      if (!response.ok) throw new Error('Failed to cancel invitation')
      await fetchTeamData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel invitation')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Team Management</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Invite Form */}
          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-900 mb-4">Invite Team Member</h4>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="colleague@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'viewer')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="viewer">Viewer - Can view analytics</option>
                  <option value="admin">Admin - Can view analytics and manage team</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </form>
          </div>

          {/* Team Members */}
          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-900 mb-4">Team Members</h4>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">Loading team members...</div>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500">No team members yet</div>
              </div>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {member.user?.email || 'Unknown user'}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {member.role}
                      </div>
                    </div>
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Pending Invitations</h4>
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-yellow-50">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invitation.email}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {invitation.role} • Expires {new Date(invitation.expires_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelInvitation(invitation.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}