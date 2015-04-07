## Roadmap / To Do

Timelyn is progressing well but there's still plenty to do. This list should give you an idea of the current state of affairs. Feel free to suggest features that you think could be useful. Either create a new issue on GitHub or contact [the creator](https://studiole.uk/contact) directly.

### Pages

Home
- [ ] Getting started 
- [ ] Examples

About 
- [ ] Name derivation: timeline, timely
- [ ] Pricing

### Application

UI/UX Overhaul
- [x] Create timeline
  - [x] Timeline preview
  - [x] Integrated image upload
  - [x] Image preview
- [x] Edit timeline
- [ ] Create Event
- [ ] Edit event
- [x] Delete timeline/event

Integrate Alert.error() / Alert.set()
- [x] Delete timeline/event
- [x] Login
- [x] Register

Timelines
- [ ] Additional settings defined in embed code
- [ ] Save draft timelines
- [ ] Refine embed script
- [ ] Present embed code to user
- [ ] Publish button + logic

Media attachments 
- [x] Create model + controller with relationship to event/timeline
- [x] Direct browser upload to s3
- [ ] Automate thumbnail creation
- [ ] Image resize + compression

Publish/embed
- [ ] Create published model + controller with relationship to timeline
- [ ] /timeline/published page to list published timelines + embed code
- [ ] /timeline/id/publish page to list published timelines + embed code
- [ ] Backend Publish Controller Write directly to S3
- [ ] PublishedAt column on timeline model
- [ ] Frontend confirm publish
- [ ] Frontend publish button on /timeline/id

User settings
- [ ] Change name / email / password
- [ ] Change username?

Auth
- [ ] Password reset email + logic 
- [ ] Facebook / twitter auth?

Caching 
- [ ] Cache server side pages

Analytics
- [ ] Scrape analytics for user
- [ ] Necessary for price plan restrictions

### Admin tools

- [ ] As much as I enjoy the command line a graphical interface could be useful, particularly for analytics.
