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

    afterEach(() => {
        fixture?.destroy();
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

    it.each([
        { variant: TodoSkeletonVariants.TODO_DETAILS, desc: 'todo details', cssQuery: '.details' },
        { variant: TodoSkeletonVariants.TODO_ITEM, desc: 'todo item', cssQuery: '.todo-item-skeleton' },
        { variant: TodoSkeletonVariants.TODO_FORM_EDIT, desc: 'todo form edit', cssQuery: '.form' },
    ])('should render $desc skeleton when skeleton variant is $variant', ({ variant, cssQuery }) => {
        createComponentWithVariants(variant);
        const formSkeleton = fixture.debugElement.query(By.css(cssQuery));
        expect(formSkeleton).toBeTruthy();
    });
});
