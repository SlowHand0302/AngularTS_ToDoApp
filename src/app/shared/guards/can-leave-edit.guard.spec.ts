import { TestBed } from '@angular/core/testing';

import { CanLeaveEditGuard } from './can-leave-edit.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TodoFormComponent } from '../../todos/components/todo-form/todo-form.component';

describe('CanLeaveEditGuard', () => {
    let guard: CanLeaveEditGuard;
    let mockComponent: TodoFormComponent;
    let confirmSpy: jest.SpyInstance;
    // Explicitly typed as a tuple
    const routeArgs: [ActivatedRouteSnapshot, RouterStateSnapshot, RouterStateSnapshot] = [
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
        {} as RouterStateSnapshot,
    ];

    const createMockComponent = (dirty = false, touched = false): TodoFormComponent => {
        return { todoForm: { dirty, touched } } as TodoFormComponent;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CanLeaveEditGuard],
        });
        guard = TestBed.inject(CanLeaveEditGuard);
        confirmSpy = jest.spyOn(window, 'confirm');
        mockComponent = createMockComponent();
    });

    afterEach(() => {
        confirmSpy.mockRestore(); // Clean up after each test
    });

    it('should return true if form is neither dirty nor touched', () => {
        expect(guard.canDeactivate(mockComponent as TodoFormComponent, ...routeArgs)).toBeTruthy();
        expect(confirmSpy).not.toHaveBeenCalled();
    });

    it.each([
        { dirty: true, touched: false, desc: 'dirty' },
        { dirty: false, touched: true, desc: 'touched' },
    ])('calls confirm and respects user choice when form is $desc', ({ dirty, touched }) => {
        mockComponent = createMockComponent(dirty, touched);

        // User confirms
        confirmSpy.mockReturnValueOnce(true);
        expect(guard.canDeactivate(mockComponent, ...routeArgs)).toBe(true);
        expect(confirmSpy).toHaveBeenCalledWith('Do you want to leave Editing');

        // User cancels
        confirmSpy.mockReturnValueOnce(false);
        expect(guard.canDeactivate(mockComponent, ...routeArgs)).toBe(false);
        expect(confirmSpy).toHaveBeenCalledTimes(2);
    });
});
