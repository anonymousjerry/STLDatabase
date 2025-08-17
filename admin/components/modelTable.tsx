import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'

interface Model {
  id: string
  title: string
  description: string
  source: string
  category: string
  subcategory: string
  tags: string[]
  download: number
  view: number
  like: number
  thumbnail: string
  sourceUrl: string
  imagesUrl: string[]
  price: string
  isFeatured: boolean
}

interface Props {
  data: Model[]
  onEdit: (model: Model) => void
  onDelete: (id: string) => void
}

export function ModelTable ({ data, onEdit, onDelete } : Props) {
  const columns = React.useMemo<ColumnDef<Model>[]>(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'description', header: 'Description' },
      { accessorKey: 'source', header: 'Source' },
      { accessorKey: 'category', header: 'Category' },
      { accessorKey: 'subcategory', header: 'Subcategory' },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ getValue }) => (
          <div className="flex flex-wrap gap-1">
            {(getValue() as string[]).map((t, i) => (
              <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                {t}
              </span>
            ))}
          </div>
        ),
      },
      { accessorKey: 'download', header: 'Download' },
      { accessorKey: 'view', header: 'View' },
      { accessorKey: 'like', header: 'Like' },
      {
        accessorKey: 'thumbnail',
        header: 'Thumbnail',
        cell: ({ getValue }) => (
          <img src={getValue() as string} alt="" className="w-12 h-12 object-cover rounded-md" />
        ),
      },
      {
        accessorKey: 'sourceUrl',
        header: 'Source URL',
        cell: ({ getValue }) => (
          <a href={getValue() as string} target="_blank" rel="noopener noreferrer" className="text-blue-600">
            Link
          </a>
        ),
      },
      {
        accessorKey: 'imagesUrl',
        header: 'Images',
        cell: ({ getValue }) => (
          <div className="flex gap-1">
            {(getValue() as string[]).slice(0, 2).map((url, i) => (
              <img key={i} src={url} alt="" className="w-10 h-10 object-cover rounded" />
            ))}
          </div>
        ),
      },
      { accessorKey: 'price', header: 'Price' },
      {
        accessorKey: 'isFeatured',
        header: 'Featured',
        cell: ({ getValue }) => ((getValue() as boolean) ? '✅' : '❌'),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2 justify-center">
            <button onClick={() => onEdit(row.original)} className="text-indigo-600 hover:text-indigo-900">
              Edit
            </button>
            <button onClick={() => onDelete(row.original.id)} className="text-red-600 hover:text-red-900">
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {},
  })

  return (
    <div>
      <table className="min-w-full border border-gray-300 border-collapse text-sm">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th key={header.id} className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border border-gray-300 px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
