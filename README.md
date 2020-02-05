# Tripstack

This repo contains a large part of the production code that powers the [Tripstack](https://ocustel.com/projects/tripstack) app. It is a React Native/Expo codebase written in TypeScript. I've omitted boilerplates and the parts that are not particularly insightful or too obvious. Unit tests are done with Jest but are currently far from complete and untidy. I will clean them up and add more rigorous tests later.

To check out the app, get Tripstack for [IOS](https://apps.apple.com/us/app/tripstack/id1485384771?ls=1) or [Android](https://play.google.com/store/apps/details?id=com.tripstack.tripstack).

## actions

Contains action creators for Redux. The event-based sync logic lies in `actions/sync`.

## api

A module that acts as a wrapper around the Firebase library. All API calls are sent from functions that lie here.

## cloud

Contains backend code that runs on Google servers in a managed environment (with [Cloud Functions](https://firebase.google.com/docs/functions)).

## components

Some basic UI components. I use FormContainer as a parent to form elements in order to observe errors during submission and nicely animate in/out an error box accordingly.

## data-types

Abstract data types (ADT) used throughout the app.

## database

My own abstraction layer over [SQLite](https://docs.expo.io/versions/latest/sdk/sqlite/). Each subfolder represents a different table.

## hocs

Contains higher-order components such as `withActivation`, which I use to animate a color prop of an element based on its activity status (e.g. the submit button).

## hooks

React hooks.

## reducers

Reducers for Redux.

## screens

Screen components.

## styles

Contains global styles and the `Color` class used throughout the app.

## util

Some util classes.
