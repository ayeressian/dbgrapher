import type { ColumnSchema } from '../../schema';
import { render, RenderResult, cleanup } from '@testing-library/svelte';
import Column from './Column.svelte';
import { beforeEach, describe, expect, it } from 'vitest';

describe(Column.name, () => {
	let component: RenderResult;

	beforeEach(async () => {
		const columnSchema: ColumnSchema = {
			name: 'test',
			type: 'int'
		};
		cleanup();
		component = render(Column, {
			column: columnSchema
		});
	});
	it('should render properly', () => {
		expect(component).toMatchSnapshot();
	});
});
