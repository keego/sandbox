package com.tacktechnologies.tack.Frameworks.Promise;

import javax.xml.transform.Result;

/**
 * Created by keegomyneego on 10/31/16.
 */

public class PromiseState<ResultType> {
    // Starts as PENDING then can switch to and between RESOLVED or REJECTED
    public PromiseStatus status = PromiseStatus.PENDING;

    // Assigned to when resolving or applying a transformation
    // Propogates through catch calls;
    public ResultType result = null;

    // Assigned to when rejecting or transformation throws
    public Exception exception = null;

    public <NewResultType> PromiseState<NewResultType> attemptToResolve(Function<ResultType, NewResultType> callback) {
        PromiseState<NewResultType> newState = new PromiseState<>();

        try {
            NewResultType newResult = callback.call(this.result);

            newState.status = PromiseStatus.RESOLVED;
            newState.result = newResult;
            newState.exception = null;
        } catch (Exception newException) {
            newState.status = PromiseStatus.REJECTED;
            newState.result = null;
            newState.exception = newException;
        }

        return newState;
    }

//    public <NewResultType> PromiseState<NewResultType> resolved(NewResultType newResult) {
//        PromiseState<NewResultType> newState = new PromiseState<>();
//        newState.status = PromiseStatus.RESOLVED;
//        newState.result = newResult;
//        newState.exception = null;
//
//        return newState;
//    }

    public PromiseState<ResultType> rejected(Exception newException) {
        PromiseState<ResultType> newState = new PromiseState<>();
        newState.status = PromiseStatus.REJECTED;
        newState.result = null;
        newState.exception = newException;

        return newState;
    }
}
