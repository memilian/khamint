let fs = require('fs');
let path = require('path');
let project = new Project('KhaMint tests', __dirname);
project.targetOptions = {"html5":{},"flash":{},"android":{},"ios":{}};
project.setDebugDir('build/linux');
Promise.all([Project.createProject('build/linux-build', __dirname), Project.createProject('/home/memilian/dev/lib/Kha', __dirname), Project.createProject('/home/memilian/dev/lib/Kha/Kore', __dirname)]).then((projects) => {
	for (let p of projects) project.addSubProject(p);
	let libs = [];
	if (fs.existsSync(path.join('/home/memilian/dev/lib/haxelib/mint', 'korefile.js'))) {
		libs.push(Project.createProject('/home/memilian/dev/lib/haxelib/mint', __dirname));
	}
	Promise.all(libs).then((libprojects) => {
		for (let p of libprojects) project.addSubProject(p);
		resolve(project);
	});
});
