import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {useMutation, useSuspenseQuery, queryOptions} from '@tanstack/react-query'
import { fetchIdea, updateIdea } from '#/api/ideas'

const ideaQueryOptions =(ideaId: string) => {
    return queryOptions({
        queryKey: ['idea', ideaId],
        queryFn: () => fetchIdea(ideaId),
    })
}

export const Route = createFileRoute('/ideas/$ideaId/edit')({
  component: IdeaEditPage,
  loader: async ({params, context: {queryClient}}) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId))
    
  },
})

function IdeaEditPage() {
    const {ideaId} = Route.useParams()
    const navigate = useNavigate()
    const {data: idea} = useSuspenseQuery(ideaQueryOptions(ideaId))

    const [title, setTitle] = useState(idea.title)
    const [summary, setSummary] = useState(idea.summary)
    const [description, setDescription] = useState(idea.description)
    const [tagsInput, setTagsInput] = useState(idea.tags.join(', '))

    const {mutateAsync, isPending} = useMutation({
        mutationFn: () => updateIdea(ideaId, {title, summary, description, tags: tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)}),
        onSuccess: () => {
            navigate({to: '/ideas/$ideaId', params: {ideaId}})
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await mutateAsync()
    }

  return (
    <div className='space-y-4'>
        <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold'>Edit Idea</h1>
            <Link to="/ideas/$ideaId" params={{ideaId}} className='text-sm text-blue-500 hover:underline'>Back to idea</Link>
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
          <input type="text" id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder='Optional tags, comma separated'
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className='mt-5'>
          <button type="submit" disabled={isPending}
          className="w-full bg-blue-600 text-white px-6 py-2 font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isPending ? 'Updating...' : 'Update Idea'}</button>
        </div>
      </form>
  </div>
  )
}
