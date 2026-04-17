# UX design

## Experience goals

- immediate comprehension on first load
- one primary input action for adding work
- clear separation between active and completed tasks
- strong state communication for loading, error, and empty conditions
- comfortable use on narrow mobile screens and wider desktop layouts

## Information architecture

- header with product framing and short value statement
- add-todo form in the primary action area
- main list area with active and completed items in one ordered list
- empty state panel when there are no todos
- error banner when reads or writes fail

## Interaction model

### Adding a todo

- The input is focused and visible near the top of the page
- Submitting a valid task clears the field
- The new item appears immediately through optimistic UI

### Completing a todo

- A checkbox or toggle control marks completion
- Completed tasks remain visible but visually softened
- If the request fails, the UI rolls back and shows an error banner

### Deleting a todo

- Each item exposes a delete action with a clear accessible label
- Deletion is optimistic and reversible only through refetch if an error occurs

## State design

### Empty state

- Message explains there are no tasks yet
- Secondary hint encourages adding the first task

### Loading state

- Content skeleton or inline progress treatment keeps the layout stable

### Error state

- A banner explains that data could not be loaded or saved
- The user can retry by reloading or repeating the action

## Accessibility expectations

- all controls keyboard reachable
- visible focus states
- semantic form labels and list structure
- accessible names for complete and delete actions
- color is not the only indicator of completion state

## Responsive behavior

- single-column layout on mobile
- wider content container on desktop with preserved action hierarchy
- no hidden core actions on small screens

## Visual direction

- warm, editorial interface rather than generic dashboard cards
- soft gradients and paper-like surfaces
- bold input treatment for the primary action
- clear completed-state contrast without reducing legibility
