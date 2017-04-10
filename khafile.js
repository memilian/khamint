var project = new Project('KhaMint_tests');

project.addAssets('tests/Assets/**');
project.addSources('tests/Sources');
project.addSources('Sources');
project.addLibrary('mint');

resolve(project);