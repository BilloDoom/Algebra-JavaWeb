package good.stuff.backend.utils;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;

public final class MapperUtils {
    private static final ModelMapper modelMapper;

    static {
        modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.getConfiguration().setSkipNullEnabled(true);
    }

    private MapperUtils(){
    }

    public static <S, D> D map(S source, Class<D> destinationClass) {
        if (source == null) return null;
        return modelMapper.map(source, destinationClass);
    }

    public static <S, D> D mapWithCustomConfig(S source, Class<D> destinationClass, CustomMappingConfigurator<S, D> configurator) {
        configurator.configure(modelMapper);
        return modelMapper.map(source, destinationClass);
    }

    public static <S, D> void mapToExisting(S source, D destination) {
        if (source == null || destination == null) return;
        modelMapper.map(source, destination);
    }
}
