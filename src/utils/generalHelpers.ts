// @ts-nocheck
//  Creates a random string of a specified length (defaulting to 5) using uppercase letters,
//  lowercase letters, and numbers.
export function generateUniqueId(length = 5) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Converts a string to kebab-case, making all characters lowercase and replacing spaces
// and non-alphanumersic characters with hyphens.
export function toKebabCase(str) {
  return str
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

// Transforms a snake_case string to camelCase by lowercasing the first segment and capitalizing
// the initial letter of subsequent segments.
export function toCamelCase(str) {
  return str
    .split('_')
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join('');
}

// Converts a snake_case string to PascalCase by capitalizing the first letter of each segment
// and joining them without separators.
export function toPascalCase(str) {
  return str
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

// Similar to toPascalCase, but it maintains the original casing of all characters after
// the first in each segment.
export function modifiedPascalCase(str) {
  return str
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// convert a string by splitting the string on underscores, capitalizing the first
// letter of each word, and then joining them back together with a space.
export function toTitleCase(str) {
  if (str) {
    return str
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
  return str;
}

// Converts an HTML string into a DOM element using DOMParser.
export function stringToElement(str) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body.firstChild;
}

// Creates a deep copy of an object or array using JSON serialization and deserialization.
export function deepCopy(model) {
  if (model) {
    return JSON.parse(JSON.stringify(model));
  }
  return model;
}

//  Logs a formatted message to the console, defaulting to an error type, for developer notifications
export function developerAnnounce(message, type = 'error') {
  console[type](`🔴[Developer warn]: ${message}`);
}

// Helper function that extracts the initials of a full name
export function extractInitials(fullName = '') {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  // Trim the full name and split into an array of words
  const nameParts = fullName.trim().split(/\s+/);

  if (nameParts.length === 0) {
    return ''; // Return an empty string if there are no parts found
  }

  // Get the first letter of the first name
  const firstInitial = nameParts[0][0].toUpperCase();

  // Get the last letter of the last name (only if there's more than one name part)
  const lastInitial =
    nameParts.length > 1
      ? nameParts[nameParts.length - 1][0].toUpperCase()
      : '';

  // Combine the initials
  return firstInitial + lastInitial;
}

export function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return string;
}

export function getShortOfFullName(name) {
  if (name) {
    const words = name.trim().split(/\s+/); // split by spaces
    let initials = '';

    if (words.length > 0) initials += words[0][0];
    if (words.length > 1) initials += words[1][0];

    return initials.toUpperCase();
  }
}

export function parseFullname(fullname) {
  const parsed = fullname.split(' ');
  return {
    first_name: parsed[0],
    mid_name: parsed.length > 2 ? parsed[1] : null,
    last_name: parsed[parsed.length - 1],
  };
}

export function reverseObject(obj) {
  let reversedObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      reversedObj[obj[key]] = key;
    }
  }
  return reversedObj;
}

export function scrollToTarget(targetId) {
  if (targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error('Element with ID ' + targetId + ' not found.');
    }
  }
}

export function generateArrayForEmptyElems(count, arr) {
  const generatedArr = arr.filter((item) => item !== '');

  if (generatedArr.length >= count) {
    return generatedArr;
  } else {
    return arr;
  }
}

export const getRandomBetween = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return { day, month, year, hours, minutes };
}

export function isToday(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();

  // Compare only the year, month, and date (ignore time)
  return (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  );
}

export function copyToClipboard(value) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = value;

  // Make it invisible
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';

  // Append to body
  document.body.appendChild(textarea);

  // Select and copy
  textarea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }

  // Clean up
  document.body.removeChild(textarea);
}

export const replaceEscapeSequences = (str) => {
  // Replace the escape sequences with HTML tags
  if (str) {
    return str
      .replace(/\n/g, '<br>') // Replace newline (\n) with <br>
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // Replace tab (\t) with 4 non-breaking spaces
      .replace(/\\/g, '&bsol;') // Replace backslash (\\) with &bsol; (for a backslash)
      .replace(/\'/g, '&apos;') // Replace single quote (') with &apos;
      .replace(/\"/g, '&quot;'); // Replace double quote (") with &quot;
  }
  return str;
};
export const revertEscapeSequences = (str) => {
  // Replace the HTML tags with the corresponding escape sequences
  if (str) {
    return str
      .replace(/<br>/g, '\n') // Replace <br> with \n
      .replace(/&nbsp;/g, '\t') // Replace &nbsp; with \t (tab)
      .replace(/&bsol;/g, '\\') // Replace &bsol; with \\ (backslash)
      .replace(/&apos;/g, "'") // Replace &apos; with \' (single quote)
      .replace(/&quot;/g, '"'); // Replace &quot; with \" (double quote)
  }
  return str;
};

export function shuffleArray(arr) {
  let array = [...arr]; // Create a copy to avoid modifying the original
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

export function shuffleAndTake(arr, count) {
  if (!Number.isInteger(count) || count < 0) return []; // Invalid count
  if (count === 0) return []; // Return empty array if count is 0
  if (arr.length < count) return [...arr]; // Return copy of original if count exceeds array length
  let array = [...arr]; // Create a copy
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array.slice(0, count); // Return first 'count' items
}

export const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const downloadBase64File = (
  base64Data: string,
  fileName: string,
  mimeType: string
): void => {
  try {
    let cleanData = base64Data;
    if (base64Data.includes(',')) {
      cleanData = base64Data.split(',')[1];
    }
    cleanData = cleanData.replace(/\s/g, '');

    const byteCharacters = atob(cleanData);
    const byteNumbers = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.error('Error downloading file:', e);
    console.error(
      'The start of the failed string:',
      base64Data.substring(0, 50)
    );
    throw e;
  }
};

export const downloadBinaryStringFile = (
  base64String: string,
  fileName: string,
  mimeType: string
): void => {
  // Remove data URL scheme if present
  const base64Data = base64String.replace(/^data:.+;base64,/, '');
  const byteCharacters = atob(base64Data); // Decode Base64 string
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);

  // Create a link element to download the file
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

  // Cleanup
  URL.revokeObjectURL(url);
};
