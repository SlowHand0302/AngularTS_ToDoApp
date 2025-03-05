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
        deadline: '03/10/2025',
        state: false,
        details: 'Finish the final module and deploy the project.',
    },
    {
        id: 2,
        title: 'Fix API authentication issue',
        deadline: '2025-03-08',
        state: true,
        details: 'Debug and fix JWT authentication problems in backend.',
    },
    {
        id: 3,
        title: 'Write blog post on React performance',
        deadline: '2025-03-15',
        state: false,
        details: 'Research React optimization techniques and write an article.',
    },
    {
        id: 4,
        title: 'Update portfolio website',
        deadline: '2025-03-12',
        state: false,
        details: 'Add recent projects and improve UI/UX design.',
    },
    {
        id: 5,
        title: 'Prepare for frontend interview',
        deadline: '2025-03-20',
        state: false,
        details: 'Revise key concepts in React, Angular, and JavaScript.',
    },
    {
        id: 6,
        title: "Read 'Clean Code' book",
        deadline: '2025-03-25',
        state: false,
        details: "Read and summarize key lessons from 'Clean Code' by Robert C. Martin.",
    },
    {
        id: 7,
        title: 'Set up CI/CD pipeline',
        deadline: '2025-03-14',
        state: true,
        details: 'Implement GitHub Actions for automatic testing and deployment.',
    },
    {
        id: 8,
        title: 'Refactor old React project',
        deadline: '2025-03-18',
        state: false,
        details: 'Improve code structure, remove unused dependencies, and optimize performance.',
    },
    {
        id: 9,
        title: 'Learn AWS S3 integration',
        deadline: '2025-03-22',
        state: false,
        details: 'Explore how to upload, store, and retrieve files from AWS S3.',
    },
    {
        id: 10,
        title: 'Contribute to open-source project',
        deadline: '2025-03-30',
        state: false,
        details: 'Find a good open-source project on GitHub and submit a pull request.',
    },
];
