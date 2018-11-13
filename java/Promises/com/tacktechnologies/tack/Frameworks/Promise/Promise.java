package com.tacktechnologies.tack.Frameworks.Promise;

import com.tacktechnologies.tack.TackApp;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * Created by keegomyneego on 10/27/16.
 */

// Note: a Promise is currently guaranteed to be either resolved or rejected after initialization.
public class Promise<ArgType, ResultType> {

    private PromiseState<ResultType> state = new PromiseState<>();

    private Queue<Promise<ResultType, ?>> promiseQueue = new LinkedList<>();
    private PromiseCallback<ArgType, ResultType> transformationFunction;
    private Boolean synchronous;


    // Constructor

//    private <ArgType> Promise(Function<ArgType, ResultType> transform, ArgType argument, Boolean synchronous) {
//        List<PromiseStatus> permissibleStates = Arrays.asList(PromiseStatus.PENDING);
//        this.callbacks.add(new PromiseCallback<>(function, permissibleStates));
//
//        this.transformationFunction = function.defer(argument);
//        this.synchronous = synchronous;
//    }

    private Promise(PromiseCallback<ArgType, ResultType> transform, Boolean synchronous) {
        this.transformationFunction = transform;
        this.synchronous = synchronous;
    }

    // Public

    // DONE
    static <NewResultType> Promise<Void, NewResultType> runAsync(final Function<Void, NewResultType> function) {
        // very first function can only be called if promise is currently pending
        PromiseCallback<Void, NewResultType> transform = new PromiseCallback<Void, NewResultType>() {
            @Override
            PromiseState<NewResultType> updateState(PromiseState<Void> previousState) {
                return previousState.attemptToResolve(function);
            }

            @Override
            Boolean executionIsPermittedForState(PromiseStatus promiseState) {
                return promiseState.equals(PromiseStatus.PENDING);
            }
        };

        return new Promise<>(transform, true);
    }

    // WIP
    public <NewResultType> Promise<ResultType, NewResultType> then(final Function<ResultType, NewResultType> callback) {
        // Create promise callback from standard callback to allow type safety
        PromiseCallback<ResultType, NewResultType> successCallback = new PromiseCallback<ResultType, NewResultType>() {
            @Override
            PromiseState<NewResultType> updateState(PromiseState<ResultType> previousState) {
                return previousState.attemptToResolve(callback);
            }

            @Override
            Boolean executionIsPermittedForState(PromiseStatus promiseState) {
                return promiseState.equals(PromiseStatus.RESOLVED);
            }
        };

        // Make promise out of callback
        Promise<ResultType, NewResultType> newPromise = new Promise<>(
                successCallback,
                this.synchronous
        );

        // Add promise to queue
        this.promiseQueue.add(newPromise);

        // HANDLE CASE: IMMEDIATE CALL ON RESOLVED STATE
        //NewResultType newResult = ...

        return newPromise;
    }

    // WIP
    public Promise<ResultType, ResultType> catchError(final Function<Exception, Void> callback) {

        // Create promise callback from standard callback to allow type safety
        PromiseCallback<ResultType, ResultType> failCallback = new PromiseCallback<ResultType, ResultType>() {
            @Override
            PromiseState<ResultType> updateState(PromiseState<ResultType> previousState) {
                if (previousState.exception != null) {
                    callback.call(previousState.exception);
                }

                return previousState.rejected(null);
            }

            @Override
            Boolean executionIsPermittedForState(PromiseStatus promiseState) {
                return promiseState.equals(PromiseStatus.REJECTED);
            }
        };

        // Make promise out of callback
        Promise<ResultType, ResultType> newPromise = new Promise<>(
                failCallback,
                this.synchronous
        );

        // Add promise to queue
        this.promiseQueue.add(newPromise);

        // HANDLE CASE: IMMEDIATE CALL ON RESOLVED STATE
        //currentException = ...

        return newPromise;
    }

    public void begin() {
        this.transform(new PromiseState());
    }

    //--------------------------------------------------------------------------------
    // Private methods for transforming state and propogating changes
    //--------------------------------------------------------------------------------

    private void transform(PromiseState previousState) {
        // only pending promises can be completed
        if (this.synchronous) {
            transformSync(previousState);
        } else {
            transformAsync(previousState);
        }
    }

    // Asynchronously attempts to transform promise
    private void transformAsync(final PromiseState previousState) {
        ThreadPoolExecutor poolExecutor = TackApp.getInstance().getThreadPool();

        poolExecutor.execute(new Runnable() {
            @Override
            public void run() {
                transformSync(previousState);
            }
        });
    }

    // Synchronously attempts to transform promise
    // guarantee: status will be either RESOLVED or REJECTED after call
    private void transformSync(PromiseState previousState) {
        // Use initial transform function to update state, either
        // giving a return value or an exception
        PromiseState newState = this.transformationFunction.updateState(previousState);

        for (Promise<ResultType, ?> promise : this.promiseQueue) {
            promise.transform(newState);
        }
    }
}
