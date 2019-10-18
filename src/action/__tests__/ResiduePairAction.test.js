"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typesafe_actions_1 = require("typesafe-actions");
var action_1 = require("~bioblocks-viz~/action");
describe('ResiduePairAction', function () {
    it('Should use a default namespace if none is given.', function () {
        var e_1, _a, e_2, _b;
        var namespace = 'BIOBLOCKS';
        var allReducerActions = {
            candidates: Object.values(action_1.createResiduePairActions().candidates),
            hovered: Object.values(action_1.createResiduePairActions().hovered),
            locked: Object.values(action_1.createResiduePairActions().locked),
        };
        expect(allReducerActions.candidates).toHaveLength(6);
        expect(allReducerActions.hovered).toHaveLength(6);
        expect(allReducerActions.locked).toHaveLength(6);
        try {
            for (var _c = tslib_1.__values(Object.values(allReducerActions)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var reducerActions = _d.value;
                try {
                    for (var reducerActions_1 = (e_2 = void 0, tslib_1.__values(reducerActions)), reducerActions_1_1 = reducerActions_1.next(); !reducerActions_1_1.done; reducerActions_1_1 = reducerActions_1.next()) {
                        var action = reducerActions_1_1.value;
                        expect(typesafe_actions_1.getType(action).startsWith(namespace + "/")).toBe(true);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (reducerActions_1_1 && !reducerActions_1_1.done && (_b = reducerActions_1.return)) _b.call(reducerActions_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
    it('Should use a namespace if provided.', function () {
        var e_3, _a, e_4, _b;
        var namespace = 'FRATELLIS';
        var allReducerActions = {
            candidates: Object.values(action_1.createResiduePairActions(namespace).candidates),
            hovered: Object.values(action_1.createResiduePairActions(namespace).hovered),
            locked: Object.values(action_1.createResiduePairActions(namespace).locked),
        };
        expect(allReducerActions.candidates).toHaveLength(6);
        expect(allReducerActions.hovered).toHaveLength(6);
        expect(allReducerActions.locked).toHaveLength(6);
        try {
            for (var _c = tslib_1.__values(Object.values(allReducerActions)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var reducerActions = _d.value;
                try {
                    for (var reducerActions_2 = (e_4 = void 0, tslib_1.__values(reducerActions)), reducerActions_2_1 = reducerActions_2.next(); !reducerActions_2_1.done; reducerActions_2_1 = reducerActions_2.next()) {
                        var action = reducerActions_2_1.value;
                        expect(typesafe_actions_1.getType(action).startsWith(namespace + "/")).toBe(true);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (reducerActions_2_1 && !reducerActions_2_1.done && (_b = reducerActions_2.return)) _b.call(reducerActions_2);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
    });
});
//# sourceMappingURL=ResiduePairAction.test.js.map