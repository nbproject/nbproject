var test_account = new account(1);
test_account.createMember("Cersei");
test_account.createMember("Robert");
test_account.createMember("Tommen");
test_account.createMember("Myrcella");
test_account.createMember("Joffrey");
test_account.createTask("wash");
test_account.createTask("dishes");
//test_account.assignTask("wash", "nolan");
//test_account.assignTask("wash", "nolan");
test_account.finishTask("wash", "Cersei");
var nolan = test_account.getMember("Cersei");
nolan.showCompletedTasks();