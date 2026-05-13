#pragma warning disable ASPIREBROWSERLOGS001

var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.Snake_Api>("snake-api");

builder.AddJavaScriptApp("snake-frontend", "../../App")
    .WithHttpEndpoint(port: 4200)
    .WithReference(api)
    .WithBrowserLogs();

builder.Build().Run();
