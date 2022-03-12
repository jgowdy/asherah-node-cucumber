Feature: Removing todos

  Scenario: Add and then remove a todo from an empty list
    Given an empty todo list
    When I add the todo "buy some cheese"
    And I remove the todo "buy some cheese"