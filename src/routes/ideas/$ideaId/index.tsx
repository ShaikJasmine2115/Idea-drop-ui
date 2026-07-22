import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { fetchIdea, deleteIdea } from '../../../api/ideas';

// const fetchIdea = async (ideaId: string): Promise<Idea> => {
//     const res = await api.get(`/ideas/${ideaId}`);
//     return res.data;
//     // const res = await fetch(`/api/ideas/${ideaId}`);
//     // if (!res.ok) {
//     //     throw new Error('Failed to fetch idea');
//     // }
//     // return res.json();
// }

    const ideaQueryOptions =(ideaId: string) => {
        return queryOptions({
            queryKey: ['idea', ideaId],
            queryFn: () => fetchIdea(ideaId),
        })
    }

export const Route = createFileRoute('/ideas/$ideaId/')({
  component: IdeaDetailsPage,
  loader: async ({params, context:{ queryClient }}) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
//          //  loader: async ({params} ) => {
//     return fetchIdea(params.ideaId);
    // return params.ideaId;    
            // return 'jas';
//   }
})      
                                
function IdeaDetailsPage() {
    const {ideaId} = Route.useParams();
    const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId))

    const navigate = useNavigate();

    const { mutateAsync:deleteMutate, isPending} = useMutation({
        mutationFn: () => deleteIdea(ideaId),
        onSuccess: () => {
            navigate({to: '/ideas'})
        }
    })

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this idea?');
        if (confirmDelete){
            await deleteMutate();
        } 
    }
    return <div className='p-4'>
        <Link to="/ideas" className='text-blue-500 underline block mb-4'>Back to ideas</Link>
        <h2 className='text-2xl font-bold'>{idea.title}</h2>
        <p className='mt-2 font-semibold'>{idea.summary}</p>
        <p className='mt-2'>{idea.description}</p>
        <Link to='/ideas/$ideaId/edit' params={{ideaId}} className='inline-block text-sm bg-yellow-500 hover:bg-yellow-600 mt-4 mr-2 text-white px-4 py-2 rounded-md transition block'>Edit</Link>
        <button onClick={handleDelete} disabled={isPending} 
        className='text-sm mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition 
        disabled:opacity-50 disabled:cursor-not-allowed'>{isPending ? 'Deleting...' : 'Delete'}</button>
    </div>
// const idea = Route.useLoaderData();
// return <div>Hello {idea.title}!</div>
    // const {ideaId} = Route.useParams();
    // return <div>Hello {ideaId}!</div>
            // const name = Route.useLoaderData();
            //return <div>Hello {name}!</div>
}
