export type Todo = {
    id: string | number;
    title: string;
    deadline: string;
    state: boolean;
    details: string;
};

export const todoList: Todo[] = [
    {
        id: 1,
        title: 'Complete Angular project',
        deadline: new Date('2025-10-05').toISOString(), // Convert MM/DD/YYYY to ISO
        state: false,
        details: 'Finish the final module and deploy the project.',
    },
    {
        id: 2,
        title: 'Fix API authentication issue',
        deadline: new Date('2025-03-08').toISOString(), // Already in YYYY-MM-DD, still converted
        state: true,
        details: 'Debug and fix JWT authentication problems in backend.',
    },
    {
        id: 3,
        title: 'Write blog post on React performance',
        deadline: new Date('2025-03-15').toISOString(),
        state: false,
        details: 'Research React optimization techniques and write an article.',
    },
    {
        id: 4,
        title: 'Update portfolio website',
        deadline: new Date('2025-03-12').toISOString(),
        state: false,
        details: 'Add recent projects and improve UI/UX design.',
    },
    {
        id: 5,
        title: 'Prepare for frontend interview',
        deadline: new Date('2025-03-20').toISOString(),
        state: false,
        details: 'Revise key concepts in React, Angular, and JavaScript.',
    },
    {
        id: 6,
        title: "Read 'Clean Code' book",
        deadline: new Date('2025-03-25').toISOString(),
        state: false,
        details: "Read and summarize key lessons from 'Clean Code' by Robert C. Martin.",
    },
    {
        id: 7,
        title: 'Set up CI/CD pipeline',
        deadline: new Date('2025-03-14').toISOString(),
        state: true,
        details: 'Implement GitHub Actions for automatic testing and deployment.',
    },
    {
        id: 8,
        title: 'Refactor old React project',
        deadline: new Date('2025-03-18').toISOString(),
        state: false,
        details: 'Improve code structure, remove unused dependencies, and optimize performance.',
    },
    {
        id: 9,
        title: 'Learn AWS S3 integration',
        deadline: new Date('2025-03-22').toISOString(),
        state: false,
        details: 'Explore how to upload, store, and retrieve files from AWS S3.',
    },
    {
        id: 10,
        title: 'Contribute to open-source project',
        deadline: new Date('2025-03-30').toISOString(),
        state: false,
        details: 'Find a good open-source project on GitHub and submit a pull request.',
    },
];

