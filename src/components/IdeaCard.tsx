import type { Idea } from '../types'
import { Link } from '@tanstack/react-router'
import clsx from 'clsx'

const IdeaCard = ({ idea, button=true }: { idea: Idea, button?: boolean }) => {

    const linkClasses = clsx({
        'text-blue-600 hover:underline mt-3': !button,
        'text-center inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition': button
    })
    return (
        <div className="border border-gray-300 rounded shadow bg-white p-4 flex flex-col justify-between"> 
            <div>
              <h2 className="text-lg font-semibold">{idea.title}</h2>
              <p className="text-gray-700 mt-2">{idea.summary}</p>
              <Link to='/ideas/$ideaId' params={{ideaId : idea.id.toString()}} 
              className={linkClasses}>
                {button ? 'View Idea' : 'Read more →'}
              </Link>
            </div>
          </div>
    )
}

export default IdeaCard