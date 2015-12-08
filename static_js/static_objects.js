/*
	create static objects here
	let test_account be the static account we use
	simply create users, create tasks. 

*/
var test_account = new account(1);
test_account.createMember("Cersei");
test_account.createMember("Robert");
test_account.createMember("Tommen");
test_account.createMember("Myrcella");
test_account.createMember("Joffrey");
test_account.createTask("wash");
test_account.createTask("dishes");
test_account.claimTask("wash", "Cersei");
//test_account.finishTask("wash", "Cersei");
var test_member = test_account.getMember("Cersei");
test_member.showCompletedTasks();