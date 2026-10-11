import Reconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants.js';

// The reconciler is pinned directly as a dev dependency. This in-memory renderer exercises
// real hooks and updates without adding a test stack or pretending to render native UI.
const context = {};
const noop = () => {};
let priority = 0;
const append = (parent, child) => parent.children.push(child);
const remove = (parent, child) => parent.children.splice(parent.children.indexOf(child), 1);
const insert = (parent, child, before) => {
  const oldIndex = parent.children.indexOf(child);
  if (oldIndex >= 0) parent.children.splice(oldIndex, 1);
  parent.children.splice(parent.children.indexOf(before), 0, child);
};
const renderer = Reconciler({
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: false,
  getRootHostContext: () => context,
  getChildHostContext: () => context,
  getPublicInstance: (instance) => instance,
  prepareForCommit: () => null,
  resetAfterCommit: noop,
  createInstance: (type, props) => ({ type, props, children: [] }),
  createTextInstance: (text) => ({ type: '#text', text, children: [] }),
  appendInitialChild: append,
  appendChild: append,
  appendChildToContainer: append,
  removeChild: remove,
  removeChildFromContainer: remove,
  insertBefore: insert,
  insertInContainerBefore: insert,
  shouldSetTextContent: () => false,
  finalizeInitialChildren: () => false,
  commitUpdate: (instance, _type, _oldProps, props) => {
    instance.props = props;
  },
  commitTextUpdate: (instance, _oldText, text) => {
    instance.text = text;
  },
  clearContainer: (container) => {
    container.children = [];
  },
  detachDeletedInstance: noop,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  supportsMicrotasks: true,
  scheduleMicrotask: queueMicrotask,
  getCurrentUpdatePriority: () => priority,
  setCurrentUpdatePriority: (value) => {
    priority = value;
  },
  resolveUpdatePriority: () => priority || DefaultEventPriority,
  shouldAttemptEagerTransition: () => false,
  maySuspendCommit: () => false,
});

export function renderFixture(element) {
  const container = { children: [] };
  const errors = [];
  const fail = (error) => errors.push(error);
  const root = renderer.createContainer(
    container,
    1,
    null,
    false,
    null,
    '',
    fail,
    fail,
    fail,
    null,
  );
  const flush = (action) => {
    renderer.flushSyncFromReconciler(action);
    renderer.flushPassiveEffects();
    if (errors.length) throw errors.shift();
  };
  flush(() => renderer.updateContainer(element, root, null, null));
  const findAll = (type) => {
    const found = [];
    const visit = (node) => {
      if (node.type === type) found.push(node);
      node.children.forEach(visit);
    };
    visit(container);
    return found;
  };
  return {
    findAll,
    flush,
    unmount: () => flush(() => renderer.updateContainer(null, root, null, null)),
  };
}
