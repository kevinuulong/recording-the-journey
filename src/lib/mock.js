// NOTE: Some of the functions in this file are AI generated. See JSDoc comments for details.

import { page } from "$app/state";

/**
 * Generates mock book reading data for a specified number of past and present days.
 * The data is returned as a single, flat array of daily records.
 * Each day object contains a 'date' Unix timestamp and 'pages' read.
 * Pages are randomly generated for past and present days, and are zero for future days.
 * NOTE: This function is AI generated using Gemini 2.5 Flash!
 *
 * @param {number} numDays - The number of days to generate data for (e.g., 28 for the past month).
 * @returns {Array<Object>} A flat array of day objects with mock data.
 */
export function generateMockReadingLog(numDays) {
    const data = [];
    const now = new Date();
    const oneDayInSeconds = 24 * 60 * 60;

    let pages = 0; // Initialize a variable to track the last pages value
    let streak = 0; // Initialize a streak counter

    // Calculate the timestamp for today at midnight.
    const todayTimestamp = Math.floor(now.setHours(0, 0, 0, 0) / 1000);

    // Loop for the specified number of days, starting from today and going backward
    for (let i = numDays - 1; i >= 0; i--) {
        const dayTimestamp = todayTimestamp - i * oneDayInSeconds;
        const dayDate = new Date(dayTimestamp * 1000);

        // Only generate random pages for past or current days
        if (dayDate.setHours(0, 0, 0, 0) <= now.setHours(0, 0, 0, 0)) {
            // Continue a streak of non-zero pages or check for a new one
            if (streak > 0 || Math.random() > 0.7) { // 30% chance to start a new streak
                pages = Math.floor(Math.random() * 200) + 1; // Ensure pages are at least 1
                streak = Math.max(0, streak - 1); // Decrement the streak counter
            } else {
                pages = 0;
                if (Math.random() < 0.5) { // 50% chance to start a new streak of non-zero pages
                    streak = Math.floor(Math.random() * 14) + 1; // Random streak length of 1-14 days
                }
            }
        } else {
            pages = 0; // Pages are 0 for future days
        }

        data.push({
            date: dayTimestamp,
            pages: pages,
        });

    }

    return data;
}

export const mockBookData = [{
    uuid: "3c5af21c-a3c0-4f1f-a3e5-e558e64b747f",
    title: "Mexican Gothic",
    authors: ["Silvia Moreno-Garcia"],
    coverURL: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1607462569i/53152636.jpg",
    page: 100,
},
{
    uuid: "4fc6940a-b111-474e-98ee-a8ec9fcf9e50",
    title: "A Gentleman in Moscow",
    authors: ["Amor Towles"],
    coverURL: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1718915012i/34066798.jpg",
    dateCompleted: 1757822400,
    page: 462

},{
    uuid: "a5a770f9-de9b-4dc4-8065-5171fde62177",
    title: "The Saint of Bright Doors",
    authors: ["Vajra Chandrasekera"],
    coverURL: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1707333565i/61884985.jpg",
    dateCompleted: 1757822400,
    page: 356
},{
    uuid: "70b20880-35d1-4345-bd54-53ee9ded3f1f",
    title: "Raising Hare: A Memoir",
    authors: ["Chloe Dalton"],
    coverURL: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1748353120i/214269337.jpg",
    dateCompleted: 1757822400,
    page: 304
},{
    uuid: "444fb30f-0d6d-4f93-887f-b60a8153db2b",
    title: "Tom Lake",
    authors: ["Ann Patchett"],
    coverURL: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1691084837i/63241104.jpg",
    dateCompleted: 1757822400,
    page: 309
}]