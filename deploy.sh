# build the website
gulp build

#  deploy the website to the server
rsync -avzP ./_site/ sftech@sftech.ch:/home/sftech/public_html/