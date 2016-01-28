var project = new Project('KhaMint tests');

project.addAssets('tests/Assets/**');
project.addSources('tests/Sources');
project.addSources('Sources');
project.addLibrary('mint');

return project;