export interface AdPositionValidationErrors {
  title?: string;
  page?: string;
  position?: string;
  adType?: string;
  size?: string;
  priority?: string;
  adSlot?: string;
  clientName?: string;
  clientEmail?: string;
  startDate?: string;
  endDate?: string;
  enabled?: string;
}

export interface AdPositionFormData {
  title?: string;
  page?: "homepage" | "detail" | "explore";
  position?: string;
  adType?: "banner" | "sidebar" | "sponsored-model";
  size?: "728x90" | "300x250" | "300x600" | "native";
  priority?: number;
  adSlot?: string;
  clientName?: string;
  clientEmail?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

export const validateAdPosition = (data: AdPositionFormData): AdPositionValidationErrors => {
  const errors: AdPositionValidationErrors = {};

  // Title validation
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Page validation
  if (!data.page) {
    errors.page = 'Page is required';
  } else if (!['homepage', 'detail', 'explore'].includes(data.page)) {
    errors.page = 'Page must be homepage, detail, or explore';
  }

  // Position validation
  if (!data.position || data.position.trim() === '') {
    errors.position = 'Position is required';
  } else if (data.position.length > 100) {
    errors.position = 'Position must be less than 100 characters';
  }

  // Ad Type validation
  if (!data.adType) {
    errors.adType = 'Ad Type is required';
  } else if (!['banner', 'sidebar', 'sponsored-model'].includes(data.adType)) {
    errors.adType = 'Ad Type must be banner, sidebar, or sponsored-model';
  }

  // Size validation
  if (!data.size) {
    errors.size = 'Size is required';
  } else if (!['728x90', '300x250', '300x600', 'native'].includes(data.size)) {
    errors.size = 'Size must be 728x90, 300x250, 300x600, or native';
  }

  // Priority validation
  if (data.priority === undefined || data.priority === null) {
    errors.priority = 'Priority is required';
  } else {
    const priorityNum = Number(data.priority);
    if (isNaN(priorityNum) || !Number.isInteger(priorityNum) || priorityNum < 1 || priorityNum > 10) {
      errors.priority = 'Priority must be a number between 1 and 10';
    }
  }

  // Ad Slot validation
  if (data.adSlot && data.adSlot.trim() !== '') {
    if (data.adSlot.length < 10) {
      errors.adSlot = 'Ad Slot ID must be at least 10 characters long';
    } else if (data.adSlot.length > 100) {
      errors.adSlot = 'Ad Slot ID must be less than 100 characters';
    } else if (!/^[a-zA-Z0-9\-_]+$/.test(data.adSlot)) {
      errors.adSlot = 'Ad Slot ID can only contain letters, numbers, hyphens, and underscores';
    }
  }

  // Client Name validation
  if (data.clientName && data.clientName.trim() !== '') {
    if (data.clientName.length < 2) {
      errors.clientName = 'Client name must be at least 2 characters long';
    } else if (data.clientName.length > 50) {
      errors.clientName = 'Client name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s\-']+$/.test(data.clientName)) {
      errors.clientName = 'Client name can only contain letters, spaces, hyphens, and apostrophes';
    }
  }

  // Client Email validation
  if (data.clientEmail && data.clientEmail.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.clientEmail)) {
      errors.clientEmail = 'Please enter a valid email address';
    } else if (data.clientEmail.length > 100) {
      errors.clientEmail = 'Email must be less than 100 characters';
    }
  }

  // Date validation and range validation
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (data.startDate && data.startDate.trim() !== '') {
    const startDateStr = data.startDate.trim();
    // Handle ISO date strings (remove time part if present)
    const cleanStartDateStr = startDateStr.split('T')[0];
    
    // Try multiple date formats
    if (cleanStartDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // YYYY-MM-DD format
      const [year, month, day] = cleanStartDateStr.split('-').map(Number);
      startDate = new Date(Date.UTC(year, month - 1, day));
    } else if (cleanStartDateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      // MM/DD/YYYY format
      const [month, day, year] = cleanStartDateStr.split('/').map(Number);
      startDate = new Date(Date.UTC(year, month - 1, day));
    } else {
      // Try default parsing
      startDate = new Date(cleanStartDateStr);
    }
    
    if (isNaN(startDate.getTime())) {
      errors.startDate = 'Please enter a valid start date (YYYY-MM-DD or MM/DD/YYYY)';
    }
  }

  if (data.endDate && data.endDate.trim() !== '') {
    const endDateStr = data.endDate.trim();
    // Handle ISO date strings (remove time part if present)
    const cleanEndDateStr = endDateStr.split('T')[0];
    
    // Try multiple date formats
    if (cleanEndDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // YYYY-MM-DD format
      const [year, month, day] = cleanEndDateStr.split('-').map(Number);
      endDate = new Date(Date.UTC(year, month - 1, day));
    } else if (cleanEndDateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      // MM/DD/YYYY format
      const [month, day, year] = cleanEndDateStr.split('/').map(Number);
      endDate = new Date(Date.UTC(year, month - 1, day));
    } else {
      // Try default parsing
      endDate = new Date(cleanEndDateStr);
    }
    
    if (isNaN(endDate.getTime())) {
      errors.endDate = 'Please enter a valid end date (YYYY-MM-DD or MM/DD/YYYY)';
    }
  }

  // Date range validation - only if both dates are valid
  if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
    if (startDate >= endDate) {
      errors.endDate = 'End date must be after start date';
    }
  }

  // Enabled validation (optional boolean field)
  if (data.enabled !== undefined && typeof data.enabled !== 'boolean') {
    errors.enabled = 'Enabled must be a boolean value';
  }

  return errors;
};

export const hasValidationErrors = (errors: AdPositionValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const getFieldError = (errors: AdPositionValidationErrors, field: keyof AdPositionValidationErrors): string | undefined => {
  return errors[field];
};

export const isFieldValid = (errors: AdPositionValidationErrors, field: keyof AdPositionValidationErrors): boolean => {
  return !errors[field];
};
