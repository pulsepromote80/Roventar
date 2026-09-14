'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getEditNews,
  updateNews,
} from '@/app/redux/slices/adminMasterSlice'
import Table from '@/app/common/datatable'
import { toast } from 'react-toastify'
import { FaEdit, FaTimes, FaSave, FaNewspaper, FaAlignLeft } from 'react-icons/fa'

const ManageNews = () => {
  const dispatch = useDispatch()
  const { editNewsData, } = useSelector((state) => state.adminMaster)

  const [showEditPopup, setShowEditPopup] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const [editForm, setEditForm] = useState({
    newsId: '',
    news: '',
  })
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    const didFetch = window.__didFetchEditNews
    if (didFetch) return
    window.__didFetchEditNews = true

    const fetchNews = async () => {
      const result = await dispatch(getEditNews({ newsId: "1" })).unwrap()
    }
    fetchNews()
  }, [dispatch])

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  const tableColumns = [
    {
      key: 'sno',
      label: 'S.No',
      render: (value) => (
        <span className="text-gray-800 dark:text-gray-200 font-medium">
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'news',
      label: 'News',
      render: (value) => (
        <span
          className="text-gray-800 dark:text-gray-200 font-medium block"
          dangerouslySetInnerHTML={{ __html: value || '-' }}
        />
      ),
    },
    
    {
      key: 'newsDate',
      label: 'Date & Time',
      render: (value) => (
        <span className="text-gray-700 dark:text-gray-300">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (value, row) => (
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm"
          onClick={(e) => {
            e.stopPropagation()
            handleEditClick(row)
          }}
        >
          <FaEdit className="text-xs" />
          Edit
        </button>
      ),
    },
  ]

  const handleEditClick = (news) => {
    setSelectedNews(news)
    setEditForm({
      newsId: String(news.NewsId || news.newsId || ''),
      news: news.news || '',
    })
    setShowEditPopup(true)
  }

  const handleUpdateNews = async () => {
    if (!editForm.news.trim()) {
      toast.error('News content is required')
      return
    }

    setUpdateLoading(true)
    try {
      const result = await dispatch(updateNews(editForm)).unwrap()
      if (result?.statusCode === 200) {
        toast.success('News updated successfully!')
        setShowEditPopup(false)
        dispatch(getEditNews({ newsId: "1" }))
      } else {
        toast.error('Failed to update news')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to update news')
    } finally {
      setUpdateLoading(false)
    }
  }

  const newsData = editNewsData?.data || []

  return (
    <div>
      <div>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
              <FaNewspaper className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Manage News
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Edit and manage news articles
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaNewspaper className="text-xl" />
              News List
            </h2>
            <p className="text-emerald-100 text-sm mt-1">View and edit news articles</p>
          </div>

          <div className="p-6">
            <Table
              columns={tableColumns}
              data={newsData.map((news, index) => ({
                ...news,
                sno: index + 1,
              }))}
              title="News Articles"
            />
          </div>
        </div>

        {/* Edit News Popup */}
        {showEditPopup && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FaEdit className="text-xl" />
                  Edit News
                </h2>
                <button
                  onClick={() => setShowEditPopup(false)}
                  className="text-white/80 hover:text-white"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Form */}
              <div className="flex-1 p-5 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FaAlignLeft className="text-emerald-500" />
                      News Content
                    </label>
                    <textarea
                      value={editForm.news}
                      onChange={(e) => setEditForm({ ...editForm, news: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all resize-none"
                      placeholder="Enter news content (HTML supported)"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowEditPopup(false)}
                    className="inline-flex items-center cursor-pointer gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    <FaTimes className="text-xs" />
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateNews}
                    disabled={updateLoading}
                    className="inline-flex items-center cursor-pointer gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateLoading ? (
                      'Updating...'
                    ) : (
                      <>
                        <FaSave className="text-xs" />
                        Update News
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageNews