package com.tacktechnologies.tack.Frameworks.Promise;

/**
 * Created by keegomyneego on 10/31/16.
 */

abstract class PromiseCallback<PreviousResultType, NextResultType> {

    // Either arg may be null
    abstract PromiseState<NextResultType> updateState(PromiseState<PreviousResultType> previousState);

    // Returns whether or not this callback should be called
    // based on the given state of the current promise
    abstract Boolean executionIsPermittedForState(PromiseStatus promiseStatus);
}
