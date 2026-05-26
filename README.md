# Ente favorites batch import

A simple pipeline that enables the recovery of your Google Photos favorites collection in Ente, without duplicating any photos.

https://github.com/user-attachments/assets/3bcbd57a-ea35-41fb-8040-5ba843160e53

> Demo of the script in action

## Background

After migrating from Google Photos to Ente and despite the [seamless migration process](https://ente.com/help/photos/migration/from-google-photos/), I experienced the frustration of loosing my favorite photos curation. 

Despite my best efforts to find a solution, I could only find [this issue](https://github.com/ente-io/ente/issues/4877) in which the only workaround proposed is to duplicate the photos, which I wanted to avoid. 

But I wasn't ready to give up yet. After realizing that I could search by the photos filename on Ente and manually mark them as favorite, I started doing some reverse engineering to automate this process, which I implemented sucessfully (with Antigravity Flash assistance) and now share openly for those who may find it useful.

## Procedure

1. Go to your Google Photos favorites, select all photos and download them as a .zip file.
2. Extract the photos to a folder on your computer and name it `photos`
3. Download `1_list_google_photos_favorites.py`, save it on the same level as the `photos` folder, and run it. It will create a file named `photos_list.js`
4. Open Ente in your browser (either at ente.com, ente.io or your custom domain in case you are self-hosting)
5. Open the browser console, through `CTRL+K` keys or by right clicking anywhere on the screen and selecting "Inspect" option
6. Paste the content of `2_ente_batch_favorites.js` into the console
7. Update the variable `NO_RESULTS_TEXT` to match the "No results found" message of your region (type any random string in the search bar to get the expected value)
8. Update `photosWithExtension` with the corresponding variable in `photos_list.js` (generated in step 3)
9. Press `ENTER` to execute the script. A button should appear on the top right corner of the screen with the text "Run favorites script"
10. Press the button and let the script run its course. It will take some time depending on the number of photos you have. 
11. When the script finishes, an alert is prompted with a summary of the execution and two CSV files are downloaded with the log of photos favorited and those not found, so that you can manually verify them

Some notes:
- During the script execution, don't click anywhere on the screen. By doing so, the mouse focus will be lost and the script won't be able to interact with the browser. 
- If you have a very large collection of photos, the browser might run out of memory and crash. In this case, check which was the last photo that was favorited and remove the previous from the `photosWithExtension` variable before running the script again.
- Whatever happens, you can always re-run the script. It detects if a photo ahs already been favorited and ignores it if so. 
