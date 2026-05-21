'use strict';

global.separeter = { csv: ',', tsv: '\t' };

const { multiWordReplacer, makeMap } = require('./multiple-word-replacer');

describe('makeMap', () => {
	test('CSV形式の辞書からMapを生成する', () => {
		const map = makeMap('cat,dog\ndog,goat', ',');
		expect(map.get('cat')).toBe('dog');
		expect(map.get('dog')).toBe('goat');
	});

	test('TSV形式の辞書からMapを生成する', () => {
		const map = makeMap('cat\tdog\ndog\tgoat', '\t');
		expect(map.get('cat')).toBe('dog');
		expect(map.get('dog')).toBe('goat');
	});

	test('列数が2以外の行をスキップする', () => {
		const map = makeMap('cat,dog\ninvalid_line\ngoat,cat', ',');
		expect(map.get('cat')).toBe('dog');
		expect(map.get('goat')).toBe('cat');
		expect(map.has('invalid_line')).toBe(false);
	});

	test('空の辞書は空のMapを返す', () => {
		const map = makeMap('', ',');
		expect(map.size).toBe(0);
	});
});

describe('multiWordReplacer', () => {
	test('READMEのサンプル: cat→dog, dog→goat, goat→catを正しく循環置換する', () => {
		const dict = 'cat,dog\ndog,goat\ngoat,cat';
		const result = multiWordReplacer(dict, 'csv', 'I have a cat, a dog, and a goat.');
		expect(result).toBe('I have a dog, a goat, and a cat.');
	});

	test('単一の単語を置換する', () => {
		const dict = 'hello,world';
		const result = multiWordReplacer(dict, 'csv', 'hello');
		expect(result).toBe('world');
	});

	test('複数箇所を同時に置換する', () => {
		const dict = 'foo,bar\nbaz,qux';
		const result = multiWordReplacer(dict, 'csv', 'foo and baz');
		expect(result).toBe('bar and qux');
	});

	test('長いキーが短いキーより優先される', () => {
		// "cat" と "ca" が両方あった場合、"cat" が優先される
		const dict = 'cat,DOG\nca,XX';
		const result = multiWordReplacer(dict, 'csv', 'cat');
		expect(result).toBe('DOG');
	});

	test('辞書にないワードはそのまま残る', () => {
		const dict = 'hello,world';
		const result = multiWordReplacer(dict, 'csv', 'hello unknown');
		expect(result).toBe('world unknown');
	});

	test('TSVセパレータで動作する', () => {
		const dict = 'cat\tdog';
		const result = multiWordReplacer(dict, 'tsv', 'I have a cat.');
		expect(result).toBe('I have a dog.');
	});
});
