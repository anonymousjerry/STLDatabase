// components/ThangsCategorySubcategory.tsx
import React from 'react'
import { useFormValue, set, unset } from 'sanity'
import { Select } from '@sanity/ui'
import { StringInputProps } from 'sanity'
import { thangsList } from '../../static/data/thangsList'

export default function ThangsCategorySubcategory(props: StringInputProps) {
  const { value, onChange, readOnly, id } = props
  const parentCategory = useFormValue(['thangsCategory']) as string | undefined

  const options = React.useMemo(
    () =>
      thangsList
        .filter(([cat]) => cat === parentCategory)
        .map(([_, sub]) => sub)
        .filter(Boolean),
    [parentCategory],
  )

  return (
    <Select
      id={id}
      value={value || ''}
      onChange={(e) => {
        const selected = e.currentTarget.value
        onChange(selected ? set(selected) : unset())
      }}
      readOnly={readOnly}
    >
      {options.map((sub) => (
        <option key={sub} value={sub}>
          {sub}
        </option>
      ))}
    </Select>
  )
}
