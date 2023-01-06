const defaultTitle = document.title;
dsa.data.addObserver("title.title", title => document.title = title ?? defaultTitle );
