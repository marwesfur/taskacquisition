export class Tasks {
    private tasks = [];

    public getTasks() {
        return this.tasks;
    }

    public addTask(task) {
        this.tasks = this.tasks.concat([task]);
    }

    public removeTask(task) {
        this.tasks = this.tasks.filter(_ => _ != task);
    }
}
