"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_mock_store_1 = require("redux-mock-store");
var thunk = require("redux-thunk");
var action_1 = require("~bioblocks-viz~/action");
var middleWares = [thunk.default];
var mockStore;
describe('SpringAction', function () {
    describe('Graph Data Fetch Actions', function () {
        it('Should create error actions.', function () {
            var expectedAction = {
                payload: Error('Party crashed'),
                type: 'BIOBLOCKS/SPRING/GRAPHDATA_FETCH_DATA_FAILURE',
            };
            expect(action_1.createSpringActions().graphData.failure(Error('Party crashed'))).toEqual(expectedAction);
        });
        it('Should create request actions.', function () {
            var expectedAction = {
                type: 'BIOBLOCKS/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
            };
            expect(action_1.createSpringActions().graphData.request()).toEqual(expectedAction);
        });
        it('Should create success actions.', function () {
            var expectedAction = {
                payload: { nodes: [] },
                type: 'BIOBLOCKS/SPRING/GRAPHDATA_FETCH_DATA_SUCCESS',
            };
            expect(action_1.createSpringActions().graphData.success({ nodes: [] })).toEqual(expectedAction);
        });
        it('Should use a namespace if provided.', function () {
            expect(action_1.createSpringActions('EMINEM').graphData.failure(Error('No!')).type).toEqual('EMINEM/SPRING/GRAPHDATA_FETCH_DATA_FAILURE');
            expect(action_1.createSpringActions('EMINEM').graphData.request().type).toEqual('EMINEM/SPRING/GRAPHDATA_FETCH_DATA_REQUEST');
            expect(action_1.createSpringActions('EMINEM').graphData.success({ nodes: [] }).type).toEqual('EMINEM/SPRING/GRAPHDATA_FETCH_DATA_SUCCESS');
        });
    });
    describe('Species Actions', function () {
        it('Should create clear actions.', function () {
            var expectedAction = {
                type: 'BIOBLOCKS/SPRING/SPECIES_CLEAR',
            };
            expect(action_1.createSpringActions().species.clear()).toEqual(expectedAction);
        });
        it('Should create set actions.', function () {
            var expectedAction = {
                meta: 'spring/species',
                payload: 'mus_musculus',
                type: 'BIOBLOCKS/SPRING/SPECIES_SET',
            };
            expect(action_1.createSpringActions().species.set('mus_musculus')).toEqual(expectedAction);
        });
        it('Should use a namespace if provided.', function () {
            expect(action_1.createSpringActions('EMINEM').species.clear().type).toEqual('EMINEM/SPRING/SPECIES_CLEAR');
            expect(action_1.createSpringActions('EMINEM').species.set('homo_sapiens').type).toEqual('EMINEM/SPRING/SPECIES_SET');
        });
    });
    describe('fetchSpringGraphData Callback', function () {
        beforeEach(function () {
            mockStore = redux_mock_store_1.default(middleWares);
        });
        it('Should dispatch the right actions for successfully fetching data.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var store, expectedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store = mockStore({});
                        return [4 /*yield*/, action_1.fetchSpringGraphData(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, Promise.resolve({ nodes: [] })];
                            }); }); })(store.dispatch)];
                    case 1:
                        _a.sent();
                        expectedActions = [
                            {
                                type: 'BIOBLOCKS/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
                            },
                            {
                                payload: { nodes: [] },
                                type: 'BIOBLOCKS/SPRING/GRAPHDATA_FETCH_DATA_SUCCESS',
                            },
                        ];
                        expect(store.getActions()).toEqual(expectedActions);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should dispatch the right actions for failing to fetch data.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var store, expectedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store = mockStore({});
                        return [4 /*yield*/, action_1.fetchSpringGraphData(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, Promise.reject('No!')];
                            }); }); })(store.dispatch)];
                    case 1:
                        _a.sent();
                        expectedActions = [
                            {
                                type: 'BIOBLOCKS/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
                            },
                            {
                                payload: 'No!',
                                type: 'BIOBLOCKS/SPRING/GRAPHDATA_FETCH_DATA_FAILURE',
                            },
                        ];
                        expect(store.getActions()).toEqual(expectedActions);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should use a namespace if provided.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var store, expectedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store = mockStore({});
                        return [4 /*yield*/, action_1.fetchSpringGraphData(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, Promise.resolve({ nodes: [] })];
                            }); }); }, 'eminem')(store.dispatch)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, action_1.fetchSpringGraphData(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, Promise.reject('No!')];
                            }); }); }, 'eminem')(store.dispatch)];
                    case 2:
                        _a.sent();
                        expectedActions = [
                            {
                                type: 'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
                            },
                            {
                                payload: { nodes: [] },
                                type: 'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_SUCCESS',
                            },
                            {
                                type: 'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
                            },
                            {
                                payload: 'No!',
                                type: 'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_FAILURE',
                            },
                        ];
                        expect(store.getActions()).toEqual(expectedActions);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=SpringAction.test.js.map