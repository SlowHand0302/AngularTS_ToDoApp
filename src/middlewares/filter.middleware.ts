import { Request, Response, NextFunction } from 'express';
import { filterAdapter, searchAdapter, sortAdapter } from '../utils/mongooseFilterAdapter.utils'; // Adjust path as needed
import { RawFilterQuery } from '../types/FilterQuery.type';
import { SearchQuery } from '../types/SearchQuery.type';
import { SortOption } from '../types/QueryOptions.interface';

// Middleware to process filter queries
export const filterMiddleware = <T>() => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { sort, search, page, pageSize, ...filters } = req.query;
        console.log(req.query);
        try {
            // Convert raw query to MongoDB filter query
            if (filters) (req as any).filterQuery = filterAdapter<T>(filters as RawFilterQuery<T>); // Attach to request

            if (sort) (req as any).sortQuery = sortAdapter(sort as SortOption<T>[]);

            if (search) {
                (req as any).searchQuery = searchAdapter(search as SearchQuery<T>);
            }

            next();
        } catch (error) {
            res.status(400).json({ error: 'Invalid filter query' });
        }
    };
};
