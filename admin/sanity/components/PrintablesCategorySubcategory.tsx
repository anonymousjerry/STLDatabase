import React from 'react'
import { useFormValue, set, unset } from 'sanity'
import { Select } from '@sanity/ui'
import { StringInputProps } from 'sanity'
import { printablesList } from '../../static/data/printablesList'

export default function PrintablesCategorySubcategory(props: StringInputProps) {
  const { value, onChange, readOnly, id } = props
  const parentCategory = useFormValue(['printablesCategory']) as string | undefined

  // Map to { label: subcategory title, value: subcategory ID }
  const options = React.useMemo(() => {
    return printablesList
        .filter(([cat]) => cat === parentCategory)
        .map(([_, sub, val]) => ({ label: sub, value: val }))
    }, [parentCategory])

  return (
    <Select
  id={id}
  value={value?.toString() || ''}
  onChange={(e) => {
    const selectedValue = e.currentTarget.value
    onChange(selectedValue ? set(Number(selectedValue)) : unset()) // 👈 ensures numeric ID
  }}
  readOnly={readOnly}
>
  <option value="">Select a subcategory</option>
  {options.map((opt) => (
    <option key={opt.value} value={opt.value}>
      {opt.label}
    </option>
  ))}
</Select>
  )
}
