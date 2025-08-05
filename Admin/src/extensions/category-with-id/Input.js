// import React, { useState, useEffect } from 'react';
import { TextInput, Select } from '@strapi/design-system';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';

const CATEGORY_ID_MAP = {
  'Books': 1,
  'Games': 2,
  'Movies': 3,
};

const CategoryWithIdInput = ({ name, intlLabel, description, attribute, value, onChange }) => {
  const [category, setCategory] = useState('');
  const { modifiedData, onChange: formOnChange } = useCMEditViewDataManager();
  console.log(category)
  useEffect(() => {
    if (CATEGORY_ID_MAP[category] !== undefined) {
      formOnChange({
        target: {
          name: `${name}_id`,
          value: CATEGORY_ID_MAP[category],
          type: 'number',
        },
      });
    }
  }, [category]);

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Select
        label={intlLabel?.defaultMessage || 'Category'}
        value={category}
        onChange={(val) => setCategory(val)}
        required
      >
        {Object.keys(CATEGORY_ID_MAP).map((cat) => (
          <Select.Option key={cat} value={cat}>
            {cat}
          </Select.Option>
        ))}
      </Select>
      <TextInput
        label="Category ID"
        name={`${name}_id`}
        value={CATEGORY_ID_MAP[category] || ''}
        disabled
      />
    </div>
  );
};

export default CategoryWithIdInput;
