import { TestBed } from '@angular/core/testing';

import { CanLeaveEditGuard } from './can-leave-edit.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TodoFormComponent } from '../../todos/components/todo-form/todo-form.component';

describe('CanLeaveEditGuard', () => {
    let guard: CanLeaveEditGuard;
    let mockComponent: Partial<TodoFormComponent>;
    let confirmSpy: jest.SpyInstance;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CanLeaveEditGuard],
        });
        guard = TestBed.inject(CanLeaveEditGuard);
        confirmSpy = jest.spyOn(window, 'confirm');
        mockComponent = { todoForm: { dirty: false, touched: false } } as TodoFormComponent;
    });

    afterEach(() => {
        confirmSpy.mockRestore(); // Clean up after each test
    });

    it('should return true if form is neither dirty nor touched', () => {
        mockComponent = {
            todoForm: { dirty: false, touched: false },
        } as Partial<TodoFormComponent> as TodoFormComponent;
        expect(
            guard.canDeactivate(
                mockComponent as TodoFormComponent,
                {} as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot,
                {} as RouterStateSnapshot,
            ),
        ).toBeTruthy();
        expect(confirmSpy).not.toHaveBeenCalled();
    });

    it('should call confirm and return true if form is dirty and user confirms', () => {
        mockComponent = {
            todoForm: { dirty: true, touched: false },
        } as Partial<TodoFormComponent> as TodoFormComponent;
        confirmSpy.mockReturnValueOnce(true);
        const result = guard.canDeactivate(
            mockComponent as TodoFormComponent,
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
            {} as RouterStateSnapshot,
        );
        expect(confirmSpy).toHaveBeenCalledWith('Do you want to leave Editing');
        expect(result).toBeTruthy();
    });

    it('should call confirm and return true if form is touched and user confirms', () => {
        mockComponent = {
            todoForm: { dirty: false, touched: true },
        } as Partial<TodoFormComponent> as TodoFormComponent;
        confirmSpy.mockReturnValueOnce(true);
        const result = guard.canDeactivate(
            mockComponent as TodoFormComponent,
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
            {} as RouterStateSnapshot,
        );
        expect(confirmSpy).toHaveBeenCalledWith('Do you want to leave Editing');
        expect(result).toBeTruthy();
    });

    it('should call confirm and return false if form is dirty and user cancels', () => {
        mockComponent = {
            todoForm: { dirty: true, touched: false },
        } as Partial<TodoFormComponent> as TodoFormComponent;
        confirmSpy.mockReturnValueOnce(false);
        const result = guard.canDeactivate(
            mockComponent as TodoFormComponent,
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
            {} as RouterStateSnapshot,
        );
        expect(confirmSpy).toHaveBeenCalledWith('Do you want to leave Editing');
        expect(result).toBeFalsy();
    });

    it('should call confirm and return false if form is touched and user cancels', () => {
        mockComponent = {
            todoForm: { dirty: false, touched: true },
        } as Partial<TodoFormComponent> as TodoFormComponent;
        confirmSpy.mockReturnValueOnce(false);
        const result = guard.canDeactivate(
            mockComponent as TodoFormComponent,
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
            {} as RouterStateSnapshot,
        );
        expect(confirmSpy).toHaveBeenCalledWith('Do you want to leave Editing');
        expect(result).toBeFalsy();
    });
});
