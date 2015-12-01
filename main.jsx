// Defines a collection to hold our tasks
Tasks = new Mongo.Collection('tasks');

// This code is executed on the client only
if (Meteor.isClient) {
  
  Accounts.ui.config ({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  // Subscribes to all the data from publication named tasks
  Meteor.subscribe('tasks');

  Meteor.startup(function () {
    /**
     * Uses Meteor.startup to render the component to render-target,
     * after the page is ready
     */
    ReactDOM.render(<App />, document.getElementById('render-target'));
  });
}

// This code is executed on the server only
if (Meteor.isServer) {
  /**
   * Registers a publication named tasks
   * Only publishes tasks that are public or belong to the current user
   */
  Meteor.publish('tasks', function() {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}

Meteor.methods({
  // Adds a task
  addTask(text) {
    // Makes sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    
    // Inserts a task
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  
  // Removes a task
  removeTask(taskId) {
    const task = Tasks.findOne(taskId);
    if (task.owner !== Meteor.userId()) {
      // Makes sure only the owner can delete his tasks
      throw new Meteor.Error('not-authorized');
    }
    Tasks.remove(taskId);
  },
 
  // Sets a task's checked status
  setChecked(taskId, setChecked) {
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, makes sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  // Sets a task's private status
  setPrivate(taskId, setToPrivate) {
    const task = Tasks.findOne(taskId);

    // Makes sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("non-authorized");
    }

    // Updates tasks
    Tasks.update(taskId, {$set: {private: setToPrivate} });
  }
});