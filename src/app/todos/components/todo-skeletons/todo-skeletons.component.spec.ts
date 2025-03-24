import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSkeletonsComponent } from './todo-skeletons.component';
import { TodoSkeletonVariants } from '../../../shared/constants/varianst.enum';
import { By } from '@angular/platform-browser';

describe('TodoSkeletonsComponent', () => {
    let component: TodoSkeletonsComponent;
    let fixture: ComponentFixture<TodoSkeletonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoSkeletonsComponent],
        }).compileComponents();
    });

    function createComponentWithVariants(variants: TodoSkeletonVariants) {
        fixture = TestBed.createComponent(TodoSkeletonsComponent);
        fixture.componentRef.setInput('variant', variants);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should create component when provide skeleton variant', () => {
        createComponentWithVariants(TodoSkeletonVariants.TODO_ITEM);
        expect(component).toBeTruthy();
    });

    it('should render 5 skeletons item when skeleton variant is TODO_ITEM', () => {
        createComponentWithVariants(TodoSkeletonVariants.TODO_ITEM);
        expect(component.numSkeletons).toHaveLength(5);
    });

    it('should render form edit skeleton when skeleton variant is TODO_FORM_EDIT', () => {
        createComponentWithVariants(TodoSkeletonVariants.TODO_FORM_EDIT);
        const formSkeleton = fixture.debugElement.query(By.css('.form'));
        expect(formSkeleton).toBeTruthy();
    });

    it('should render form edit skeleton when skeleton variant is TODO_DETAILS', () => {
        createComponentWithVariants(TodoSkeletonVariants.TODO_DETAILS);
        const formSkeleton = fixture.debugElement.query(By.css('.details'));
        expect(formSkeleton).toBeTruthy();
    });

    it('should render form edit skeleton when skeleton variant is TODO_ITEM', () => {
        createComponentWithVariants(TodoSkeletonVariants.TODO_ITEM);
        const formSkeleton = fixture.debugElement.query(By.css('.todo-item-skeleton'));
        expect(formSkeleton).toBeTruthy();
    });
});
