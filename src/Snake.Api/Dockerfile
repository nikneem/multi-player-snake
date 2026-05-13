FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Snake.Api/Snake.Api.csproj Snake.Api/
COPY Aspire/Snake.Aspire.ServiceDefaults/Snake.Aspire.ServiceDefaults.csproj Aspire/Snake.Aspire.ServiceDefaults/
RUN dotnet restore Snake.Api/Snake.Api.csproj

COPY Snake.Api/ Snake.Api/
COPY Aspire/Snake.Aspire.ServiceDefaults/ Aspire/Snake.Aspire.ServiceDefaults/
RUN dotnet publish Snake.Api/Snake.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Snake.Api.dll"]
