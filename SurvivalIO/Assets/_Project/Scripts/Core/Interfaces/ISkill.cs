using UnityEngine;

namespace SurvivalIO.Core
{
    /// <summary>
    /// Contract for active and passive skill implementations.
    /// </summary>
    public interface ISkill : IUpgradeable
    {
        string SkillName { get; }
        bool IsPassive { get; }
        void Activate(Transform user);
        void Deactivate();
    }
}

