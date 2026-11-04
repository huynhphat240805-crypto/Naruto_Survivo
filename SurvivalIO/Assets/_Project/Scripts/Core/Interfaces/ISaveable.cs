namespace SurvivalIO.Core
{
    /// <summary>
    /// Contract for systems that serialize and restore state.
    /// </summary>
    public interface ISaveable
    {
        string SaveKey { get; }
        string ToJson();
        void FromJson(string json);
    }
}

