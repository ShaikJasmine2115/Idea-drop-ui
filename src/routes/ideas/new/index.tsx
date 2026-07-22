import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {useState} from 'react'
import {useMutation} from '@tanstack/react-query'
import type { Idea } from '../../../types'
import { createIdea } from '../../../api/ideas'

export const Route = createFileRoute('/ideas/new/')({
  component: NewIdeaPage,
})

function NewIdeaPage() {

  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  const { mutateAsync, isPending} = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      navigate({to: '/ideas'})
    }
  }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !summary.trim() || !description.trim()) {
      alert('Please fill in all fields')
      return;
    }
    try{
      await mutateAsync({title, summary, body: description, tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')})
    } catch (error) {
      alert('Failed to create idea')
      }
  }
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold'>Create new Idea</h1>
      </div> 
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium text-gray-700">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter idea title'
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="summary" className="block mb-1 font-medium text-gray-700">Summary</label>
          <input type="text" id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder='Enter idea summary'
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="body" className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter idea description'
          rows={6} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="tags" className="block mb-1 font-medium text-gray-700">Tags</label>
          <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder='Optional tags, comma separated'
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className='mt-5'>
          <button type="submit" disabled={isPending} 
          className="w-full bg-blue-600 text-white px-6 py-2 font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isPending ? 'Creating...' : 'Create Idea'}</button>
        </div>
      </form>
  </div>
  )
}
