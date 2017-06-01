# RadicalJS
RadicalJS is a Javascript framework designed to provide Rapid-Application-Development (RAD) functionality for javascript based applications.

# Lincense
The RadicalJS framework is provided under the Apache 2.0 license. See the LICENSE file for more information.

## Contributors
This framework has been developed by Nathan Skipper of Montgomery Technology, Inc. We gladly accept other contributors.

## Architecture
The framework consists of a base class, known as the RadicalWidget class. This class provides a means of defining graphical elements within a DOM which will carry some sort of portable behavior, much like the GUI component models in .NET or Java.

A widget is behaves both as definition and instance. The widget can be defined through a JSON description of the basic "Widget" level functions. When a widget is used within a document, the designer can define events for the instance of a widget and then implement a widget as an instance. An example of this would be an instance of a "Button" widget, which might have an instance ID of "Button1". This instance's click event would be handled through a function defined in the script of the DOM as "Button1_OnInstanceClick".

The framework also provides a class known as the RadicalFrame class. This class represents a frame or form which will contain widgets. This class is comparable to the WinForm Form class, or the Frame in Java.

Also in the framework, under the "designer" folder, are utility classes for designing a widget and a frame using Graphical tools similar to those used with WinForms or NetBeans. This folder is a good reference for understanding how the RadicalWidget and RadicalFrame classes can be used in an implementation.
