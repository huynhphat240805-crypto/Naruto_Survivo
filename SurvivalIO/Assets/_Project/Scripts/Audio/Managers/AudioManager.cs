using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Audio
{
    /// <summary>
    /// Central manager for audio volume, music tracks, and sound effect playback.
    /// </summary>
    public class AudioManager : MonoBehaviour
    {
        private static AudioManager _instance;
        public static AudioManager Instance => _instance;

        [Header("Controllers")]
        [SerializeField] private MusicController _musicController;
        [SerializeField] private SFXController _sfxController;

        [Header("Audio Library")]
        [SerializeField] private List<AudioData> _audioClips = new List<AudioData>();

        [Header("Master Volumes")]
        [Range(0f, 1f)] [SerializeField] private float _masterVolume = 1f;
        [Range(0f, 1f)] [SerializeField] private float _musicVolume = 0.8f;
        [Range(0f, 1f)] [SerializeField] private float _sfxVolume = 1f;

        private readonly Dictionary<string, AudioData> _audioMap = new Dictionary<string, AudioData>();

        public float MasterVolume => _masterVolume;
        public float MusicVolume => _musicVolume;
        public float SFXVolume => _sfxVolume;

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);
            ServiceLocator.Register(this);

            EnsureControllers();
            BuildAudioMap();
        }

        private void EnsureControllers()
        {
            if (_musicController == null)
            {
                _musicController = gameObject.AddComponent<MusicController>();
            }
            if (_sfxController == null)
            {
                _sfxController = gameObject.AddComponent<SFXController>();
            }
        }

        private void BuildAudioMap()
        {
            _audioMap.Clear();
            foreach (var data in _audioClips)
            {
                if (!string.IsNullOrEmpty(data.Id) && !_audioMap.ContainsKey(data.Id))
                {
                    _audioMap.Add(data.Id, data);
                }
            }
        }

        public void PlaySFX(string clipId)
        {
            if (_audioMap.TryGetValue(clipId, out AudioData data))
            {
                _sfxController.PlayOneShot(data.Clip, data.Volume * _sfxVolume * _masterVolume, data.Pitch);
            }
            else
            {
                Debug.LogWarning($"[AudioManager] Audio clip '{clipId}' not found.");
            }
        }

        public void PlayMusic(string clipId)
        {
            if (_audioMap.TryGetValue(clipId, out AudioData data))
            {
                _musicController.PlayMusic(data.Clip, data.Volume * _musicVolume * _masterVolume);
            }
        }

        public void StopMusic()
        {
            _musicController?.StopMusic();
        }

        public void SetMasterVolume(float volume)
        {
            _masterVolume = Mathf.Clamp01(volume);
            _musicController?.SetVolume(_musicVolume * _masterVolume);
            _sfxController?.SetVolume(_sfxVolume * _masterVolume);
        }

        public void SetMusicVolume(float volume)
        {
            _musicVolume = Mathf.Clamp01(volume);
            _musicController?.SetVolume(_musicVolume * _masterVolume);
        }

        public void SetSFXVolume(float volume)
        {
            _sfxVolume = Mathf.Clamp01(volume);
            _sfxController?.SetVolume(_sfxVolume * _masterVolume);
        }

        private void OnDestroy()
        {
            if (_instance == this)
            {
                ServiceLocator.Unregister<AudioManager>();
            }
        }
    }
}

