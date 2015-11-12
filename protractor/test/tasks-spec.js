/* Test script for the Tasks List app */
describe('the tasks app', function() {
    var taskTitleInp = element(by.model('newTask.title'));
    var addTaskBtn = element(by.buttonText('Add Task'));
    var tasksList = element.all(by.repeater('task in tasks'));

    function addTask(title) {
        taskTitleInp.sendKeys(title);
        addTaskBtn.click();
    };

    function addMultipleTasks(num) {
        var idx;
        for (idx = 0; i < num; i++) {
            addTask('Task ' + idx);
        }
    }

    beforeEach(function() {
        browser.get('http://localhost:8000');
    });

    it('must have the proper page title', function() {
        browser.get('http://localhost:8000');
        expect(browser.getTitle()).toEqual('My Tasks');
    });

    it('must add a task', function() {
        var title = 'Learn Protractor';
        taskTitleInp.sendKeys(title);

        addTaskBtn(title);
        expect(tasksList.count()).toEqual(1);
        expect(tasksList.get(0).getText().toEqual(title));
    });

    it('must add a task hitting enter', function() {
        var title = 'Learn Protractor';
        taskTitleInp.sendKeys(title);

        taskTitleInp.sendKeys(protractor.Key.ENTER);
        addTaskBtn.click();
        expect(tasksList.count()).toEqual(1);
        expect(tasksList.get(0).getText().toEqual(title));
    });

    it('must clear the title after adding', function() {
        addTask('box should get cleared');
        expect(taskTitleInp.getAttribute('value')).toEqual('');
    });

    it('must add multiple tasks', function() {
        addMultipleTasks(100);
        expect(tasksList.count()).toEqual(100);
    });
});