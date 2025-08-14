import React, { useEffect, useState } from 'react'
import { useClient } from 'sanity'

interface Model {
  _id: string
  title: string
  price: string
  views: number
  downloads: number
  deleted: boolean
}

export function ModelTable() {
  const client = useClient()
  const [models, setModels] = useState<Model[]>([])

  useEffect(() => {
    client
      .fetch(`*[_type == "model"]{_id, title, price, views, downloads, deleted}`)
      .then(setModels)
  }, [client])

  if (!models.length) return <div>No models found.</div>

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Title</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Views</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Downloads</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Deleted</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {models.map((model) => (
          <tr key={model._id}>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{model.title}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{model.price}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{model.views}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{model.downloads}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
              {model.deleted ? 'Yes' : 'No'}
            </td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
              <button
                onClick={() => window.location.assign(`/desk/edit/${model._id}`)}
                style={{ marginRight: 8 }}
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('Delete this model?')) {
                    await client.delete(model._id)
                    setModels(models.filter((m) => m._id !== model._id))
                  }
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
