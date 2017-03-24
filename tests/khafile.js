var project = new Project('KhaMint tests');

project.addAssets('Assets/**');
project.addSources('Sources');
project.addSources('../Sources');
project.addLibrary('mint');

resolve(project);